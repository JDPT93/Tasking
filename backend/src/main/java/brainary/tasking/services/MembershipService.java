package brainary.tasking.services;

import java.util.Objects;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.MembershipEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.MembershipRepository;
import brainary.tasking.schemas.MembershipSchema;

@Service
public class MembershipService {
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MembershipRepository membershipRepository;

    public MembershipSchema create(MembershipSchema membershipSchema) {
        if (membershipRepository.existsById(membershipSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("membership.conflict", null, LocaleContextHolder.getLocale()));
        }
        return modelMapper.map(membershipRepository.save(modelMapper.map(membershipSchema, MembershipEntity.class)), MembershipSchema.class);
    }

    public MembershipSchema deleteById(Integer membershipId) {
        MembershipSchema membershipSchema = findById(membershipId);
        membershipRepository.deleteById(membershipId);
        return membershipSchema;
    }

    public Page<MembershipSchema> findAll(Pageable Pageable) {
        return membershipRepository.findAll(Pageable).map(membershipEntity -> modelMapper.map(membershipEntity, MembershipSchema.class));
    }

    public MembershipSchema findById(Integer membershipId) {
        return modelMapper.map(membershipRepository.findById(membershipId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("membership.not-found", null, LocaleContextHolder.getLocale()))), MembershipSchema.class);
    }

    public ChangelogPayload<MembershipSchema> update(MembershipSchema newMembershipSchema) {
        MembershipSchema oldMembershipSchema = findById(newMembershipSchema.getId());
        BeanUtils.copyProperties(oldMembershipSchema, newMembershipSchema,
            Stream.of(BeanUtils.getPropertyDescriptors(MembershipSchema.class)).filter(descriptor -> {
                try {
                    return !Objects.isNull(descriptor.getReadMethod().invoke(newMembershipSchema));
                } catch (Exception exception) {
                    return true;
                }
            }).map(descriptor -> descriptor.getName()).toArray(String[]::new));
        membershipRepository.save(modelMapper.map(newMembershipSchema, MembershipEntity.class));
        return ChangelogPayload.<MembershipSchema>builder()
            .before(oldMembershipSchema)
            .after(newMembershipSchema)
            .build();
    }

}
